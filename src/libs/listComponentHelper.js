import { isFunction } from 'lodash';
import Moment from 'moment';
import i18n from '../../utils/i18n';
import { apiError2Messages } from './errorHelper';
import { apiGetList, apiPost, apiGetById, apiUpdateById } from './apiHelper';
import { LOADING_STATE, REFRESHING_STATE } from './componentHelper';

export const STATE_OPTION_LIST = [
  'intransit',
  'shipping,received',
  'pending',
  'completed',
  'failed',
];

export const currentDate = Moment(new Date()).utc().format('YYYY-MM-DD');
export const prevDate = Moment().subtract(3, 'days').format('YYYY-MM-DD');

export const initComponent = (self, props) => {
  self.state = getInitalStateFromProps(props);
};

const getInitalStateFromProps = (props) => {
  const {
    modelName,
    apiEndpoint,
    query,
    objectList,
    pageLoad,
    manipulation,
    prevObjectId,
    objectId,
    afterObjectLoaded,
    afterNewObjectLoaded,
    fields,
  } = props;

  return {
    modelName,
    pageLoad: pageLoad || {},
    query: {
      ...query,
      queryName: '',
      isDefaultQuery: false,
    },
    showAdvancedSearch: false,
    afterObjectLoaded,
    afterNewObjectLoaded,
    objectList,
    prevObjectId,
    objectId:
      objectId || props.navigation
        ? props.navigation.getParam('ObjectId', '')
        : '',
    goToObject: false,
    success: false,
    error: null,
    isLoading: false,
    apiEndpoint,
    manipulation,
    fields,
  };
};

export async function loadComponentData(self) {
  self.setState({
    ...self.state,
    isLoading: true,
  });

  const {
    apiEndpoint,
    objectId,
    query,
    object,
    afterObjectLoaded,
    afterNewObjectLoaded,
    fields,
  } = self.state;

  if (self.state.refreshing) {
    self.setState(REFRESHING_STATE);
  } else {
    // self.setState(LOADING_STATE);
  }

  if (objectId && objectId !== '') {
    const { error, data } = await apiGetById(apiEndpoint.readOne, objectId); // TODO: Only get model's field set
    if (error) {
      self.setState({
        error: true,
        messages: apiError2Messages(error),
        isLoading: false,
      });
      return;
    } else {
      self.setState({
        isLoading: false,
        object: data,
        objectId,
      });
    }
    if (data) {
      if (isFunction(afterObjectLoaded)) {
        await afterObjectLoaded(self, data);
        self.setState({
          ...self.state,
        });
      }
    }
  } else if (object) {
    if (isFunction(afterNewObjectLoaded)) {
      await afterNewObjectLoaded(self, object);
    }
  } else {
    const { error, data } = await apiGetList(apiEndpoint.read, '');
    if (error) {
      self.setState({
        error: true,
        messages: apiError2Messages(error),
        isLoading: false,
      });
      return;
    }

    self.setState({
      ...self.state,
      objectList: data,
      isLoading: false,
      fields,
    });
  }
  self.setState({
    ...self.state,
    isLoading: false,
  });
}

export async function onUpdate(self) {
  // event.preventDefault();
  self.setState(LOADING_STATE);

  const { apiEndpoint, model, object, objectId, images } = self.state;
  try {
    const { error, data } = await apiUpdateById(
      apiEndpoint.update,
      objectId,
      object
    );

    if (error) {
      self.setState({
        isLoading: false,
        error: true,
        messages: apiError2Messages(error),
      });
    } else {
      self.setState({
        isLoading: false,
        success: true,
        messages: i18n.t('updateSuccess'),
      });
    }
  } catch (error) {
    console.log('error : ', error);
  }
}

export async function onCreate(self) {
  // event.preventDefault();
  self.setState(LOADING_STATE);
  const { apiEndpoint, model, object } = self.state;
  
  try {
    const { error, data } = await apiPost(apiEndpoint.create, object);
    if (error) {
      self.setState({
        isLoading: false,
        error: true,
        messages: apiError2Messages(error),
      });
    } else {
      self.setState({
        isLoading: false,
        success: true,
        objectId: data.data._id,
        messages: i18n.t('createSuccess'),
      });
    }
  } catch (error) {
    console.log('error : ', error);
  }
}
