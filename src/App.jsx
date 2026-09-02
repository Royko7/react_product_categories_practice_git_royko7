/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import { useState } from 'react';
import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categoryId => categoryId.id === product.categoryId,
  ); // find by product.categoryId
  const user = usersFromServer.find(userId => userId.id === category.ownerId); // find by category.ownerId

  return { ...product, category, user };
});

function getVisibleProducts(allProducts, userId, query, categoryId) {
  let result = allProducts;
  const formatedQuery = query.trim().toLowerCase();

  if (userId) {
    result = result.filter(product => product.user.id === userId);
  }

  if (query) {
    result = result.filter(
      film => film.name.toLowerCase().includes(formatedQuery), // цю війну з комою я програв((((
    );
  }

  if (categoryId.length > 0) {
    result = result.filter(
      product => categoryId.includes(product.categoryId), // і тут  програв((((
    );
  }

  return result;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const visibleProducts = getVisibleProducts(
    products,
    selectedUser,
    query,
    selectedCategory,
  );

  function filteredCategory(categoryId) {
    setSelectedCategory(currentIds => {
      if (currentIds.includes(categoryId)) {
        return currentIds.filter(id => id !== categoryId);
      }

      return [...currentIds, categoryId];
    });
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                onClick={() => setSelectedUser(0)}
                href="#/"
                className={classNames({ 'is-active': selectedUser === 0 })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': user.id === selectedUser,
                  })}
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query ? (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  ) : (
                    ''
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setSelectedCategory([])}
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  key={category.id}
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectedCategory.includes(category.id),
                  })}
                  onClick={() => filteredCategory(category.id)}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                onClick={() => setSelectedUser(0)}
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            ''
          )}
          {visibleProducts.length !== 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(item => (
                  <tr data-cy="Product" key={item.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {item.id}
                    </td>

                    <td data-cy="ProductName">{item.name}</td>
                    <td data-cy="ProductCategory">
                      {item.category.icon} - {item.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': item.user.sex === 'm',
                        'has-text-danger': item.user.sex === 'f',
                      })}
                    >
                      {item.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};
