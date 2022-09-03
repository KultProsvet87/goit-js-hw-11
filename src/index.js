import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import { getGallerydData } from './js/getGalleryData';

import createMarkUp from './templates/imgCardMarkUp.hbs';

const searchParams = {
  params: {
    q: null,
    page: 1,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  },
};
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
  if (
    !e.currentTarget.elements.searchQuery.value ||
    searchParams.params.q === e.currentTarget.elements.searchQuery.value
  )
    return;

  refs.gallery.innerHTML = '';
  searchParams.params.q = e.currentTarget.elements.searchQuery.value;
  e.currentTarget.elements.searchQuery.value = '';
  searchParams.params.page = 1;
  const res = await getGallerydData(searchParams);

  if (!res.data.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(res.data));
  maxPage = Math.ceil(res.data.totalHits / searchParams.params.per_page);
  observer.observe(refs.scrollPoint);
  gallery.refresh();
  Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
}

async function galleryUpdate(enteries) {
  if (refs.gallery.innerHTML == '') return;
  if (!enteries[0].isIntersecting) return;
  if (searchParams.params.page == maxPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  searchParams.params.page += 1;
  const res = await getGallerydData(searchParams);
  refs.gallery.insertAdjacentHTML('beforeend', createMarkUp(res.data));
  gallery.refresh();
}
