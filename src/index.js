import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchApi } from './api/searchApi';
import { refs } from './js/refs';

import createMarkUp from './templates/imgCardMarkUp.hbs';

let q = null;
let page = 1;
let per_page = 40;
let maxPage = 1;

const observerOptions = {
  root: null,
  rootMargin: '200px',
  threshold: 1,
};

const observer = new IntersectionObserver(galleryUpdate, observerOptions);

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
gallery.on('show.simplelightbox');

refs.form.addEventListener('submit', onSearchSubmit);

async function onSearchSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  q = e.currentTarget.elements.searchQuery.value;
  page = 1;
  let res = null;
  try {
    res = await searchApi.get('?', { params: { q, page, per_page } });
  } catch (err) {
    Notify.failure('Something went wrong');
  }

  if (!res.data.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(res.data));
  maxPage = Math.ceil(res.data.totalHits / per_page);
  observer.observe(refs.scrollPoint);
  gallery.refresh();
  Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
}

async function galleryUpdate(enteries) {
  if (refs.gallery.innerHTML == '') return;
  if (!enteries[0].isIntersecting) return;
  if (page == maxPage) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  page += 1;
  let res = null;
  try {
    res = await searchApi.get('?', { params: { q, page, per_page } });
  } catch (err) {
    Notify.failure('Something went wrong');
  }
  refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(res.data));
  gallery.refresh();
}
