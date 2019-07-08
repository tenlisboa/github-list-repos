import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    const { data } = await api.get(`/repos/${newRepo}`);

    const repo = {
      name: data.full_name,
    };

    this.setState({
      repositories: [...repositories, repo],
      newRepo: '',
      loading: false,
    });
  };

  render() {
    const { newRepo, loading, repositories } = this.state;
    return (
      <div>
        <Container>
          <h1>
            <FaGithubAlt />
            Repositories
          </h1>

          <Form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Add repository"
              value={newRepo}
              onChange={this.handleInputChange}
            />

            <SubmitButton loading={loading}>
              {!loading ? (
                <FaPlus color="#fff" size={14} />
              ) : (
                <FaSpinner color="#fff" size={14} />
              )}
            </SubmitButton>
          </Form>

          <List>
            {repositories.map(repository => (
              <li key={repository.name}>
                <span>{repository.name}</span>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                  Details
                </Link>
              </li>
            ))}
          </List>
        </Container>
      </div>
    );
  }
}

export default Main;
