import Link from 'next/link';
import { FileSearch, Home, Upload } from 'lucide-react';
import CustomButton from '@/components/ui/custom/CustomButton';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center section-padding bg-black/90">
      <div className="container max-w-2xl">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-gray-300/70">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileSearch className="w-32 h-32 text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-md mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/">
              <CustomButton variant="primary" leftIcon={<Home size={20} />}>
                Retour à l'accueil
              </CustomButton>
            </Link>
            
            <Link href="/upload">
              <CustomButton variant="outline" leftIcon={<Upload size={20} />}>
                Analyser un contrat
              </CustomButton>
            </Link>
          </div>
          
          <div className="bg-gray-400/20 p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-4">Vous cherchez quelque chose en particulier ?</h3>
            
            <div className="space-y-3">
              <Link 
                href="/upload"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700/20 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-3">
                  <Upload className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Analyser un contrat</p>
                  <p className="text-sm text-gray-400">Téléversez et analysez vos documents</p>
                </div>
              </Link>
              
              <Link 
                href="/history"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700/20 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <FileSearch className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Historique des analyses</p>
                  <p className="text-sm text-gray-400">Retrouvez vos analyses précédentes</p>
                </div>
              </Link>
              
              <Link 
                href="/pricing"
                className="flex items-center p-3 rounded-lg hover:bg-gray-700/20 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-green-500">€</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Tarifs et abonnements</p>
                  <p className="text-sm text-gray-400">Comparez nos plans et fonctionnalités</p>
                </div>
              </Link>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-8">
            Si vous pensez qu'il s'agit d'une erreur, veuillez{' '}
            <a href="mailto:support@Jurisk.io.com" className="text-yellow-600 hover:underline">
              contacter notre support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}