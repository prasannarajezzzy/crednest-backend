import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './App';
import { prerenderRoutes } from './content/site';
import { getSeoData } from './lib/seo';

export function render(pathname: string) {
  return {
    html: renderToString(
      <StaticRouter location={pathname}>
        <AppRoutes />
      </StaticRouter>,
    ),
    seo: getSeoData(pathname),
  };
}

export const routes = prerenderRoutes;
