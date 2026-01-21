'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, FileText, Shield, Clock, CheckCircle, CreditCard } from 'lucide-react';
import FileUpload from '@/components/upload/FileUpload';
import CustomButton from '@/components/ui/custom/CustomButton';
import Alert from '@/components/ui/custom/Alert';
import { useRouter } from 'next/navigation';

interface UserCredits {
  credits: number;
  plan: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  // Récupérer les crédits de l'utilisateur
  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const response = await fetch('/api/user/credits');
        const data = await response.json();
        
        if (data.success) {
          setUserCredits({
            credits: data.credits,
            plan: data.plan
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des crédits:', error);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchUserCredits();
  }, []);

  const handleUploadComplete = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    setError(null);
  };

  const handleAnalyze = async () => {
    // Vérifier les crédits
    if (userCredits && userCredits.credits <= 0) {
      setError('Vous n\'avez plus de crédits disponibles. Veuillez recharger votre compte.');
      return;
    }

    if (files.length === 0) {
      setError('Veuillez sélectionner un fichier à analyser.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      // Appel à votre API réelle
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      if (!data.success) {
        throw new Error(data.error || 'Échec de l\'upload');
      }

      // Mettre à jour les crédits localement
      if (userCredits) {
        setUserCredits({
          ...userCredits,
          credits: data.creditsRemaining
        });
      }
      
      setSuccess('Fichier uploadé avec succès ! Redirection vers l\'analyse...');
      
      // Rediriger vers la page de résultat avec l'ID du contrat
      setTimeout(() => {
        router.push(`/result/${data.contractId}`);
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'analyse. Veuillez réessayer.';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const limits = [
    { label: 'Crédits disponibles', value: userCredits ? `${userCredits.credits} crédit${userCredits.credits > 1 ? 's' : ''}` : 'Chargement...' },
    { label: 'Taille max', value: '10 MB' },
    { label: 'Formats', value: 'PDF, DOC, DOCX, TXT' },
    { label: 'Traitement', value: '30 secondes' },
  ];

  const calculateProgress = () => {
    if (!userCredits) return '0%';
    // Pour un utilisateur FREE, maximum 10 crédits initialement
    const maxCredits = userCredits.plan === 'PREMIUM' ? 100 : 10;
    return `${((maxCredits - userCredits.credits) / maxCredits * 100)}%`;
  };

  return (
    <div className="section-padding bg-black/90">
      <div className="container max-w-4xl">
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Analyser un contrat</h1>
          <p className="text-gray-400">
            Téléversez votre document pour une analyse complète des risques, obligations et pouvoirs.
          </p>
        </div>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Erreur"
              children={error}
              icon={<AlertCircle className="w-5 h-5" />}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              title="Succès"
              children={success}
              icon={<CheckCircle className="w-5 h-5" />}
              onClose={() => setSuccess(null)}
            />
          </div>
        )}

        {/* Compteur de crédits */}
        <div className="mb-8">
          <div className="p-6 bg-gray-100/5 border border-gray-300/20 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Vos crédits</h3>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-gray-400/50 rounded-full overflow-hidden mr-4">
                    <div 
                      className="h-full bg-yellow-600 transition-all duration-300"
                      style={{ width: calculateProgress() }}
                    />
                  </div>
                  <span className="text-yellow-600 font-bold">
                    {loadingCredits ? 'Chargement...' : (
                      userCredits ? (
                        <>
                          {userCredits.credits} crédit{userCredits.credits > 1 ? 's' : ''} disponible{userCredits.credits > 1 ? 's' : ''}
                        </>
                      ) : 'Non disponible'
                    )}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Plan: {userCredits?.plan === 'PREMIUM' ? (
                    <span className="text-green-500 font-semibold">Premium</span>
                  ) : (
                    <span className="text-yellow-600">Gratuit</span>
                  )}
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <CreditCard className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-gray-400">
                    {userCredits?.plan === 'PREMIUM' ? 'Renouvellement mensuel' : 'Recharge manuelle'}
                  </p>
                </div>
                <a href="/pricing" className="inline-block">
                  <CustomButton variant="outline" size="sm">
                    {userCredits?.plan === 'PREMIUM' ? 'Gérer mon abonnement' : 'Passer à Premium'}
                  </CustomButton>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Zone d'upload */}
        <div className="mb-12">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            maxFiles={1}
            maxSizeMB={10}
            allowedTypes={[
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/msword',
              'text/plain'
            ]}
            className="mb-6"
          />
          
          {/* Bouton d'analyse */}
          <div className="text-center">
            <CustomButton
              size="lg"
              variant="outline"
              onClick={handleAnalyze}
              isLoading={isUploading}
              disabled={loadingCredits || (userCredits && userCredits.credits <= 0) || files.length === 0 || isUploading}
              className="min-w-[200px]"
            >
              {isUploading ? 'Analyse en cours...' : 'Lancer l\'analyse'}
            </CustomButton>
            
            {userCredits && userCredits.credits <= 0 && (
              <div className="mt-2">
                <p className="text-red-400 text-sm">
                  Vous n'avez plus de crédits disponibles.
                </p>
                <a href="/pricing" className="text-yellow-600 hover:underline text-sm">
                  Recharger mes crédits ou passer à Premium →
                </a>
              </div>
            )}
            
            <p className="text-gray-500 text-sm mt-4">
              En cliquant, vous acceptez nos{' '}
              <a href="#" className="text-yellow-600 hover:underline">conditions d'utilisation</a>
              {' '}et notre{' '}
              <a href="#" className="text-yellow-600 hover:underline">politique de confidentialité</a>.
            </p>
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <h4 className="font-semibold">Sécurité maximale</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Vos documents sont chiffrés de bout en bout et supprimés automatiquement après 30 jours.
            </p>
          </div>
          
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="font-semibold">Multi-formats</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Support complet des formats courants, même les documents scannés avec OCR intégré.
            </p>
          </div>
          
          <div className="bg-gray-900/30 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h4 className="font-semibold">Qualité garantie</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Notre IA atteint une précision de 94% sur l'identification des clauses critiques.
            </p>
          </div>
        </div>

        {/* Limites */}
        <div className="bg-gray-800/20 border border-gray-300/20 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">
            {userCredits?.plan === 'PREMIUM' ? 'Avantages Premium' : 'Limites de la version gratuite'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {limits.map((limit, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {limit.value}
                </div>
                <div className="text-sm text-gray-400">
                  {limit.label}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-300/20 text-center">
            <p className="text-gray-400 mb-4">
              {userCredits?.plan === 'PREMIUM' 
                ? 'Profitez de tous les avantages Premium !' 
                : 'Besoin de plus d\'analyses ou de fonctionnalités avancées ?'
              }
            </p>
            <a href="/pricing">
              <CustomButton variant="outline">
                {userCredits?.plan === 'PREMIUM' ? 'Gérer mon compte' : 'Découvrir Premium'}
              </CustomButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}