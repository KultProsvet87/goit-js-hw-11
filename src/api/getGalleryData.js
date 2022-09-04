import { Notify } from 'notiflix';
import { searchApi } from './searchApi';

export async function getGallerydData(params) {
  try {
    return await searchApi.get('', { params });
  } catch (err) {
    Notify.failure('Something went wrong');
    return;
  }
}

export const searchParams = {
  q: null,
  page: 1,
  per_page: 40,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};
