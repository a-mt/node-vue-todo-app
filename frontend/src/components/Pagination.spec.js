import { shallowMount } from '@vue/test-utils'
import Pagination from '@/components/Pagination.vue'

const gotoPage = () => {};

describe('Pagination.vue', () => {
  it('renders page 1', () => {
    const wrapper = shallowMount(Pagination, {
      props: { page: 1, pageCount: 1, gotoPage }
    });
    const items = wrapper.findAll('.pagination__item').flatMap(element => element.text());

    expect(items).toEqual(['1']);
  });

  it('renders page 1 2 >', () => {
    const wrapper = shallowMount(Pagination, {
      props: { page: 1, pageCount: 2, gotoPage }
    });
    const items = wrapper.findAll('.pagination__item').flatMap(element => element.text());

    expect(items).toEqual(['1', '2', 'Suivant']);
  });

  it('renders page < 1 2', () => {
    const wrapper = shallowMount(Pagination, {
      props: { page: 2, pageCount: 2, gotoPage }
    });
    const items = wrapper.findAll('.pagination__item').flatMap(element => element.text());

    expect(items).toEqual(['Précédent', '1', '2']);
  });

  it('renders page previous < 1 .. 3 4 5 .. 15 >', () => {
    const wrapper = shallowMount(Pagination, {
      props: { page: 4, pageCount: 15, gotoPage }
    });
    const items = wrapper.findAll('.pagination__item').flatMap(element => element.text());

    expect(items).toEqual(['Précédent', '1', '...', '3', '4', '5', '...', '15', 'Suivant']);
  });
})
