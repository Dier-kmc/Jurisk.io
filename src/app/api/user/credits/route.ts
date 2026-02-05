import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/auth-service";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const sessionUser = await AuthService.getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 },
      );
    }

    // Récupérer l'utilisateur complet avec la date de dernier refill
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        credits: true,
        plan: true,
        email: true,
        name: true,
        lastRefillDate: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    // Logique de renouvellement mensuel
    const now = new Date();
    const lastRefill = new Date(user.lastRefillDate);
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

    let currentCredits = user.credits;

    // Si plus de 30 jours passés
    if (now.getTime() - lastRefill.getTime() > thirtyDaysInMs) {
      // On remet à 3 si inférieur à 3 (Top-up)
      if (currentCredits < 3) {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: 3,
            lastRefillDate: now,
          },
        });
        currentCredits = updatedUser.credits;
      } else {
        // Si déjà assez de crédits, on met juste à jour la date pour ne pas re-vérifier demain
        // Optionnel : est-ce qu'on décale la date seulement si on donne des crédits ?
        // Si on ne touche pas à la date, l'utilisateur sera "éligible" en permanence mais n'aura rien tant qu'il a > 3 crédits.
        // C'est mieux de ne PAS toucher la date si on ne donne rien ?
        // Non, si on ne touche pas, dès qu'il passe sous 3, il reçoit le refill.
        // C'est exactement ce qu'on veut : "Vous avez droit à un refill mensuel".
        // Si vous avez > 3, vous n'en avez pas besoin. Dès que vous consommez, HOP, refill car la date est vieille.
        // C'est une logique "Tampon". Parfait.
        // Donc : NE PAS METTRE A JOUR LA DATE si on ne refill pas.
      }
    }

    return NextResponse.json({
      success: true,
      credits: currentCredits,
      plan: user.plan, // On garde plan pour compatibilité, mais sera probablement "FREE"
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Get user credits error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des crédits",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { action, amount = 1 } = body;

    if (!action || !["decrement", "add"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Action invalide" },
        { status: 400 },
      );
    }

    let newCredits: number | null = null;

    if (action === "decrement") {
      // Vérifier si l'utilisateur a assez de crédits
      const hasEnough = await AuthService.hasEnoughCredits(user.id, amount);

      if (!hasEnough) {
        return NextResponse.json(
          { success: false, error: "Crédits insuffisants" },
          { status: 400 },
        );
      }

      newCredits = await AuthService.decrementCredits(user.id, amount);
    } else if (action === "add") {
      newCredits = await AuthService.addCredits(user.id, amount);
    }

    if (newCredits === null) {
      return NextResponse.json(
        { success: false, error: "Erreur lors de la mise à jour des crédits" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      credits: newCredits,
      message: `Crédits ${action === "decrement" ? "décrémentés" : "ajoutés"} avec succès`,
    });
  } catch (error) {
    console.error("Update user credits error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour des crédits",
      },
      { status: 500 },
    );
  }
}
