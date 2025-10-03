import { extractMessage } from '@/shared/errors/extractMessage';
import {
  GenericHttpException,
  HttpException,
  InvalidInputException,
  NotFoundException,
} from '@/shared/errors/HttpExceptions';
import type { AxiosError } from 'axios';

export default function axiosErrorResponseHandler(
  error: AxiosError,
  statusCode: number
): HttpException {
  const data = error.response?.data;
  const message = extractMessage(data, error.message || 'Unexpected error');

  switch (statusCode) {
    case 404:
      return new NotFoundException(message);
    case 422:
      return new InvalidInputException(message);
    default:
      return new GenericHttpException(statusCode || 500, message);
  }
}
