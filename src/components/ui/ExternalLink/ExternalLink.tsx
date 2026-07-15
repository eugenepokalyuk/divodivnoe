import React, { FC } from 'react';

type Props = React.ComponentPropsWithoutRef<'a'> & {
  href: string;
};

/** Внешняя ссылка с обязательным rel="noopener noreferrer" — чтобы этот хвост
 *  не копировался руками у каждого мессенджера и не терялся по невнимательности. */
export const ExternalLink: FC<Props> = ({ href, children, ...rest }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
    {children}
  </a>
);
