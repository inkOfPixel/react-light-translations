import React, { PropsWithChildren, useContext, useMemo } from 'react';

interface IntlContext {
  locale: string;
  messages: Record<string, string | string[]>;
  formatMessage(
    id: { id: string },
    variables?: { [key: string]: string | number }
  ): string;
  formatMessage(
    id: { id: string },
    variables?: { [key: string]: React.ReactNode }
  ): JSX.Element[] | string;
}

interface IntlProviderProps {
  locale: string;
  messages: Record<string, string>;
}

const IntlContext = React.createContext<IntlContext | null>(null);

export function IntlProvider({
  children,
  locale,
  messages,
}: PropsWithChildren<IntlProviderProps>) {
  const value = useMemo(() => {
    function formatMessage(
      id: { id: string },
      variables?: { [key: string]: string | number }
    ): string;

    function formatMessage(
      id: { id: string },
      variables?: { [key: string]: React.ReactNode }
    ): JSX.Element[];

    function formatMessage(
      id: { id: string },
      variables?: { [key: string]: React.ReactNode }
    ): string | JSX.Element[] {
      if (!messages[id.id]) {
        console.error('missing locale data for ', id);
        return id.id;
      }
      let translatedStringSplitted = messages[id.id]
        .split(/({[^}]+})/g)
        .filter(el => el);

      let canBeStringified = true;
      const translatedStringSplittedWithVariablesReplaced = translatedStringSplitted.map(
        (part, idx) => {
          const matches = part.match(/\{(.*?)\}/);
          if (matches) {
            const variableToReplace = variables?.[matches[1]];
            if (!variableToReplace) {
              return '';
            }
            if (
              typeof variableToReplace === 'string' ||
              typeof variableToReplace === 'number'
            ) {
              return variableToReplace;
            }
            canBeStringified = false;
            return (
              <React.Fragment key={idx}>{variableToReplace}</React.Fragment>
            );
          }
          return part;
        }
      );

      if (canBeStringified) {
        return translatedStringSplittedWithVariablesReplaced.join(' ');
      }

      return translatedStringSplittedWithVariablesReplaced as JSX.Element[];
    }
    return {
      locale,
      messages,
      formatMessage,
    };
  }, [locale, messages]);
  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
}

export function useIntl() {
  const value = useContext(IntlContext);
  if (!value) {
    throw new Error(`useIntl must be used inside a IntlProvider`);
  }

  return useMemo(
    () => ({
      ...value,
    }),
    [value]
  );
}
