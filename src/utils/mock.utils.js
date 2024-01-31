import { faker } from "@faker-js/faker";

faker.location = "es";

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.lorem.lines(),
    code: faker.string.alphanumeric(8),
    price: faker.commerce.price(),
    stock: faker.string.numeric(2, { bannedDigits: ["0"] }),
    category: faker.commerce.department(),
    thumbnails: [faker.image.url()],
    isVisible: true,
  };
};

export default generateProducts;
