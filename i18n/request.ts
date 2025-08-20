import {getRequestConfig} from 'next-intl/server';
import {cookies, headers} from 'next/headers';

export default getRequestConfig(async () => {
  // Try to get locale from cookies or headers, fallback to 'en'
  const cookieStore = await cookies();
  const headersList = await headers();

  let locale = cookieStore.get('locale')?.value;

  // If no cookie, try to detect from Accept-Language header
  if (!locale) {
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
      locale = ['en', 'ar'].includes(preferredLang) ? preferredLang : 'en';
    } else {
      locale = 'en';
    }
  }

  // Ensure we have a valid locale
  if (!['en', 'ar'].includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

