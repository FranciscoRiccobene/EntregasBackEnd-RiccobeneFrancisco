export const generateUserErrorInfo = (user) => {
  return `
    One or more properties were incomplete or not valid.
    List of required properties: 
    first_name: required String, received: ${user.first_name}
    last_name: required String, received: ${user.last_name}
    email: required String, received: ${user.email}
    age: required Number, received: ${user.age}
  `;
};

export const generateProductErrorInfo = (product) => {
  return `
  One or more properties were incomplete or not valid.
  List of required properties:
  title: required String, received: ${product.title},
  description: required String, received: ${product.description},
  code: required String, received: ${product.code},
  price: required Number, received: ${product.price},
  status: required Boolean, received: ${product.status},
  stock: required  Number, received: ${product.stock},
  category: required String, received: ${product.category},
  `;
};
