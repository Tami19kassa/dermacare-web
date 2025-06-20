 
import { useTranslation } from 'react-i18next';
 

const Footer  = () =>{
     const { t } = useTranslation();
    return(
 <footer className="text-center py-6">
<p className="text-xs text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
{t('disclaimer')}
</p>
    </footer>
    );
};

export default Footer;