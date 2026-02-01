// hooks/useRegisterForm.ts
"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";

interface UseRegisterFormProps {
  onClose: () => void;
}

export function useRegisterForm({ onClose }: UseRegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordStrength).every((v) => v);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess("");

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }

      if (!isPasswordValid) {
        setError("Le mot de passe ne respecte pas les critères de sécurité");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur d'inscription");
        }

        // Connexion automatique après inscription
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          console.error("Auto-login error:", result.error);
          setSuccess("Inscription réussie ! Veuillez vous connecter.");
        } else {
          setSuccess("Inscription réussie ! Connexion en cours...");
          window.location.reload();
        }

        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, confirmPassword, isPasswordValid, onClose],
  );

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setLoading(false);
  }, []);

  return {
    // Form values
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,

    // Form state
    loading,
    error,
    success,
    passwordsMatch,
    passwordStrength,
    isPasswordValid,

    // Functions
    handleSubmit,
    resetForm,
  };
}
