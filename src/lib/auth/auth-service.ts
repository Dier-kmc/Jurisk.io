import { getServerSession } from "next-auth";
import { authOptions } from "./config";
import { prisma } from "@/lib/db/client";

export interface CurrentUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  plan: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  /**
   * Récupère l'utilisateur actuellement connecté depuis la session
   */
  static async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      console.log("AuthService: getCurrentUser called");
      
      const session = await getServerSession(authOptions);
      console.log("AuthService: session:", session);
      
      if (!session?.user?.id) {
        console.log("AuthService: No user ID in session");
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          credits: true,
          createdAt: true,
          updatedAt: true
        }
      });

      console.log("AuthService: Found user:", user);
      return user;
    } catch (error) {
      console.error('AuthService: Error getting current user:', error);
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur a des crédits suffisants
   */
  static async hasEnoughCredits(userId: string, requiredCredits: number = 1): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      });

      return !!(user && user.credits >= requiredCredits);
    } catch (error) {
      console.error('Error checking user credits:', error);
      return false;
    }
  }

  /**
   * Décrémente les crédits de l'utilisateur
   */
  static async decrementCredits(userId: string, amount: number = 1): Promise<number | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: amount
          }
        },
        select: { credits: true }
      });

      return updatedUser.credits;
    } catch (error) {
      console.error('Error decrementing user credits:', error);
      return null;
    }
  }

  /**
   * Ajoute des crédits à l'utilisateur
   */
  static async addCredits(userId: string, amount: number): Promise<number | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: amount
          }
        },
        select: { credits: true }
      });

      return updatedUser.credits;
    } catch (error) {
      console.error('Error adding user credits:', error);
      return null;
    }
  }

  /**
   * Met à jour le plan de l'utilisateur
   */
  static async updateUserPlan(userId: string, plan: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { plan }
      });

      return true;
    } catch (error) {
      console.error('Error updating user plan:', error);
      return false;
    }
  }

  /**
 * Met à jour les crédits de l'utilisateur (ajoute ou retire)
 */
  static async updateCredits(userId: string, amount: number): Promise<number | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            // Si amount est négatif, cela décrémentera, si positif cela incrémentera
            increment: amount
          }
        },
        select: { credits: true }
      });

      return updatedUser.credits;
    } catch (error) {
      console.error('Error updating user credits:', error);
      return null;
    }
  }
}