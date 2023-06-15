import i18n from '../../utils/i18n';

function parseLoginError(err) {
  let parsedError = {
    message: 'An error has occurred',
  };

  if (err.response) {
    if (err.response.data && (err.response.status === 401 || err.response.status === 403)) {
      parsedError = { message: i18n.t('invalidAccount') };
    } else if (err.response.status === 422) {
      parsedError = { message: i18n.t('emptyAccount') };
    } else {
    }
  }

  return parsedError;
}

export const errorParser = { parseLoginError };

function decodeHTMLEntities (str) {
  if(str && typeof str === 'string') {
    // strip script/html tags
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    str = str.replace(/<title[^>]*>([\S\s]*?)<\/title>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    str = str.replace('<!DOCTYPE html>', '');
    str = str.replace(/(\r\n|\n|\r)/gm, "");
    // element.innerHTML = str;
    // str = element.textContent;
    // element.textContent = '';
  }

  return str;
}


export function apiError2Messages(apiError) {
  const { status, data } = apiError;
  switch (status) {
    case 401: {
      console.log('error 401')
      return [];
    }

    case 422: {
      let errorObject;

      if (data && data.error) {
        errorObject = data.error;

        if (errorObject.errors) {
          errorObject = errorObject.errors;
        } else {
          return errorObject;
        }
      }

      if (errorObject) {
        const messages = [];

        Object.entries(errorObject).forEach(([name, value]) => {
          let message = '';

          switch (value.kind) {
            case 'required':
              message = 'system:msg.validate.required';
              break;

            default:
              message = 'system:msg.validate.failure';
              break;
          }

          messages.push({
            name,
            message,
          });
        });

        return messages;
      }

      return `system:msg.httpResponseCode.${status.toString()}`;
    }

    case 500: {
      const errorObject = data && data.error ? data.error : undefined;

      if (errorObject && errorObject.message) {
        return errorObject.message;
      }

      return `system:msg.httpResponseCode.${status.toString()}`;
    }

    case 404: {
      const errorObject = data && data.error ? data.error : undefined;

      if (errorObject && errorObject.message) {
        return errorObject.message;
      }

      return `[${status.toString()}] ${decodeHTMLEntities(data)}`;
    }

    default:
      return `[${status.toString()}] ${i18n.t('serverError')}`;
  }
}