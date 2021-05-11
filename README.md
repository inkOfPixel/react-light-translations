# Uber minimal translation library for React
Heavily inspired by [react-intl](https://formatjs.io/docs/react-intl/)

```bash
yarn add react-light-tranlations
```

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider, useIntl } from 'react-light-translations';

const messages = {
  it: require('./lang/it.json'),
  en: require('./lang/en.json'),
};

const App = () => {
  const locale = 'en';
  return (
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={messages[locale] as Record<string, string>}
    >
      <TestApp />
    </IntlProvider>
  );
};

function TestApp() {
  const { formatMessage } = useIntl();
  return (
    <div>
      <div>{formatMessage({ id: 'test' })}</div>
      <div>
        {formatMessage(
          { id: 'testWithVariable' },
          {
            variable: 'VARIABLE',
          }
        )}
      </div>
      <div>
        {formatMessage(
          { id: 'testWithElementVariable' },
          {
            variable: (
              <span style={{ fontWeight: 'bold' }}>VARIABLE ELEMENT</span>
            ),
          }
        )}
      </div>
      <div>
        {formatMessage(
          { id: 'testWithElementVariable' },
          {
            variable: (
              <span style={{ color: 'red' }}>
                {formatMessage({ id: 'test' })}
              </span>
            ),
          }
        )}
      </div>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
```
