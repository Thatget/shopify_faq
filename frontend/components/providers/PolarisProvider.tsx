// import { useNavigate } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
// import { useCallback } from 'react';
import translations from '@shopify/polaris/locales/en.json';
import React from 'react';

// interface IAppBridgeLink {
//   url: string;
//   children?: React.ReactNode;
//   external?: boolean;
// }

// const AppBridgeLink: React.FC<IAppBridgeLink> = ({
//   url,
//   children,
//   external,
//   ...rest
// }) => {
//   // const navigate = useNavigate();
//   const handleClick = useCallback(() => {
//     // navigate(url);
//   }, []);

//   const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

//   if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
//     return (
//       <a {...rest} href={url} target="_blank" rel="noopener noreferrer">
//         {children}
//       </a>
//     );
//   }

//   return (
//     <a {...rest} onClick={handleClick}>
//       {children}
//     </a>
//   );
// };

/**
 * Sets up the AppProvider from Polaris.
 * @desc PolarisProvider passes a custom link component to Polaris.
 * The Link component handles navigation within an embedded app.
 * Prefer using this vs any other method such as an anchor.
 * Use it by importing Link from Polaris, e.g:
 *
 * ```
 * import {Link} from '@shopify/polaris'
 *
 * function MyComponent() {
 *  return (
 *    <div><Link url="/tab2">Tab 2</Link></div>
 *  )
 * }
 * ```
 *
 * PolarisProvider also passes translations to Polaris.
 *
 */
export const PolarisProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  return (
    <AppProvider 
      i18n={translations}
      // linkComponent={AppBridgeLink}
    >
      {children}
    </AppProvider>
  );
};
