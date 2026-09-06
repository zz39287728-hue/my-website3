import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { Sparkles, Palette, Home, Users, Edit2, Play, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { ViewModule } from '../types';

export const DesignPreferences: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { globalState, lang, t, setShowOnboarding } = useAppContext();
  const isRTL = lang === 'ar';
  
  const activeClient = globalState.clients[globalState.activeClientId];
  const preferences = activeClient?.profile?.designPreferences || {};
  const hasPreferences = Object.keys(preferences).length > 0;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => setView(ViewModule.PROFILE)}
          className="flex items-center gap-2 text-luxury-500 hover:text-luxury-800 dark:hover:text-luxury-200 transition-colors text-sm font-bold"
        >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {isRTL ? 'العودة' : 'Back'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-luxury-900 dark:text-white mb-2">
            {isRTL ? 'تفضيلات التصميم' : 'Design Preferences'}
          </h2>
          <p className="text-luxury-600 dark:text-luxury-400">
            {isRTL 
              ? 'ملخص لاختياراتك في استبيان التصميم الداخلي.'
              : 'Summary of your interior design quiz selections.'}
          </p>
        </div>
        {hasPreferences && (
          <Button onClick={() => setShowOnboarding(true)} className="flex items-center gap-2 self-start md:self-auto whitespace-nowrap">
            <Edit2 size={16} />
            {isRTL ? 'تعديل الاختيارات' : 'Edit Selections'}
          </Button>
        )}
      </div>

      {!hasPreferences ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-luxury-300 dark:border-luxury-700 bg-luxury-50/50 dark:bg-luxury-900/20">
          <div className="w-20 h-20 rounded-full bg-luxury-100 dark:bg-luxury-800 flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-luxury-400 dark:text-luxury-500" />
          </div>
          <h3 className="text-2xl font-bold text-luxury-900 dark:text-white mb-4">
            {isRTL ? 'لم تقم بملء استبيان التصميم' : 'You haven\'t completed the design quiz'}
          </h3>
          <p className="text-luxury-600 dark:text-luxury-400 max-w-lg mb-8 leading-relaxed">
            {isRTL 
              ? 'يبدو أنك قمت بتخطي الاستبيان أثناء تسجيل الدخول. يساعدنا الاستبيان على فهم ذوقك واحتياجاتك بدقة لنتمكن من تقديم أفضل تجربة تصميم تناسبك تماماً.'
              : 'It looks like you skipped the quiz during login. The quiz helps us accurately understand your taste and needs so we can provide the best design experience.'}
          </p>
          <Button 
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-2 px-8 py-3 text-lg"
          >
            <Play size={20} />
            {isRTL ? 'بدء الاستبيان الآن' : 'Start Quiz Now'}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <Sparkles size={24} className="text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-luxury-900 dark:text-white">
                  {isRTL ? 'الأسلوب المفضل' : 'Preferred Style'}
                </h3>
                <p className="text-luxury-500 text-sm">Interior Design Style</p>
              </div>
            </div>
            <div className="bg-luxury-50 dark:bg-luxury-900 p-4 rounded-xl">
              <p className="font-bold text-luxury-800 dark:text-luxury-200 capitalize">
                {preferences.style || '—'}
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <Palette size={24} className="text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-luxury-900 dark:text-white">
                  {isRTL ? 'الألوان المفضلة' : 'Preferred Colors'}
                </h3>
                <p className="text-luxury-500 text-sm">Color Palette</p>
              </div>
            </div>
            <div className="bg-luxury-50 dark:bg-luxury-900 p-4 rounded-xl">
              <p className="font-bold text-luxury-800 dark:text-luxury-200 capitalize">
                {preferences.colors || '—'}
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <Home size={24} className="text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-luxury-900 dark:text-white">
                  {isRTL ? 'المساحة الأهم' : 'Most Important Space'}
                </h3>
                <p className="text-luxury-500 text-sm">Key Area</p>
              </div>
            </div>
            <div className="bg-luxury-50 dark:bg-luxury-900 p-4 rounded-xl">
              <p className="font-bold text-luxury-800 dark:text-luxury-200 capitalize">
                {preferences.space || '—'}
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <Users size={24} className="text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-luxury-900 dark:text-white">
                  {isRTL ? 'نوع العائلة' : 'Family Type'}
                </h3>
                <p className="text-luxury-500 text-sm">Occupants</p>
              </div>
            </div>
            <div className="bg-luxury-50 dark:bg-luxury-900 p-4 rounded-xl flex flex-col gap-2">
              <p className="font-bold text-luxury-800 dark:text-luxury-200 capitalize">
                {preferences.family_type || '—'}
              </p>
              {preferences.exact_children_count && (
                <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                  {isRTL ? 'عدد الأطفال:' : 'Number of children:'} <span className="font-bold">{preferences.exact_children_count}</span>
                </p>
              )}
              {Array.from({ length: parseInt(preferences.exact_children_count || '0') }).map((_, i) => (
                <div key={i} className="text-sm text-luxury-500 dark:text-luxury-400 pl-2 border-l-2 border-luxury-200 dark:border-luxury-700">
                  {isRTL ? `الطفل ${i + 1}:` : `Child ${i + 1}:`} {preferences[`child_${i}_gender`]} ({preferences[`child_${i}_age`]} {isRTL ? 'سنوات' : 'years'})
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <AlertCircle size={24} className="text-gold-600 dark:text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-luxury-900 dark:text-white">
                  {isRTL ? 'الحيوانات الأليفة' : 'Pets'}
                </h3>
                <p className="text-luxury-500 text-sm">Do you have pets?</p>
              </div>
            </div>
            <div className="bg-luxury-50 dark:bg-luxury-900 p-4 rounded-xl flex flex-col gap-2">
              <p className="font-bold text-luxury-800 dark:text-luxury-200 capitalize">
                {preferences.has_pets || '—'}
              </p>
              {preferences.has_pets === 'yes' && preferences.pet_types && (
                <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                  {isRTL ? 'الأنواع:' : 'Types:'} <span className="font-bold">
                    {Array.isArray(preferences.pet_types) 
                      ? preferences.pet_types.map((p: string) => p === 'other' ? preferences.pet_type_other : p).join(', ')
                      : preferences.pet_types === 'other' ? preferences.pet_type_other : preferences.pet_types}
                  </span>
                </p>
              )}
            </div>
          </Card>
          
          {/* Other preferences can be displayed here dynamically if needed */}
        </div>
      )}
    </div>
  );
};
