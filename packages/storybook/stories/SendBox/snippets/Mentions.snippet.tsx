import { Mention, SendBox, FluentThemeProvider } from '@azure/communication-react';
import React, { useEffect } from 'react';

const suggestions: Mention[] = [
  {
    id: '1',
    displayText: ''
  },
  {
    id: '2',
    displayText: 'Patricia Adams'
  },
  {
    id: '3',
    displayText: '1'
  },
  {
    id: '4',
    displayText: 'Your user'
  },
  {
    id: 'everyone',
    displayText: 'Everyone'
  }
];
const trigger = '@';

export const MentionsExample: () => JSX.Element = () => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem', marginTop: '12rem' }}>
        <SendBox
          onSendMessage={async (message) => {
            timeoutRef.current = setTimeout(() => {
              alert(`sent message: ${message} `);
            }, delayForSendButton);
          }}
          onTyping={async () => {
            return;
          }}
          mentionLookupOptions={{
            trigger,
            onQueryUpdated: async (query: string) => {
              const filtered = suggestions.filter((suggestion) => {
                return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
              });
              return Promise.resolve(filtered);
            }
          }}
        />
      </div>
    </FluentThemeProvider>
  );
};
