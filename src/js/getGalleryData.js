import { Notify } from 'notiflix';
import { searchApi } from '../api/searchApi';

export async function getGallerydData(params) {
  let res = null;
  try {
    res = await searchApi.get('', params);
  } catch (err) {
    Notify.failure('Something went wrong');
  }
  return res;
}
