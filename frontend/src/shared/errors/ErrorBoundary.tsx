import StatusView from '@/shared/errors/components/StatusView';

import {
  HttpException,
  NotFoundException,
} from '@/shared/errors/HttpExceptions';

import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof NotFoundException) {
    return <StatusView />;
  }

  if (error instanceof HttpException) {
    return <StatusView />;
  }

  if (isRouteErrorResponse(error)) {
    return <StatusView />;
  }

  return <StatusView />;
}
