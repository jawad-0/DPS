console.log('Value:', value);
console.warn('Warning: Something unexpected happened!');
console.error('Error: Something went wrong!');
console.info('Info: This is an informational message.');

console.group('Component Debugging');
console.log('Component state:', this.state);
console.log('Component props:', this.props);
console.groupEnd();

const data = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
console.table(data);
