import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => ({
  userAPI: { getAll: jest.fn().mockResolvedValue({ data: [] }) },
  categoryAPI: { getAll: jest.fn().mockResolvedValue({ data: [] }) },
  productAPI: { getAll: jest.fn().mockResolvedValue({ data: [] }) },
}));

test('renders app header', () => {
  render(<App />);
  const header = screen.getByText(/MERN Microservices App/i);
  expect(header).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  render(<App />);
  expect(screen.getByText('Users')).toBeInTheDocument();
  expect(screen.getByText('Categories')).toBeInTheDocument();
  expect(screen.getByText('Products')).toBeInTheDocument();
});
