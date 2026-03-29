import '@testing-library/jest-dom';

HTMLInputElement.prototype.setSelectionRange = jest.fn();

HTMLElement.prototype.scrollIntoView = jest.fn();
