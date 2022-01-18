import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from './components/Сard';

import './App.css';

export type FoodItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const foodList: Array<FoodItem> = [
  {
    id: 1,
    title: 'Burger menu',
    description:
      'Burger made with minced Spanish beef Black Angus, cheddar cheese, soy - garlic mayonnaise.',
    image:
      'https://dostavka.happy.bg/remote/files/images/21689/fit_600_376.png?rev=1635515815',
  },
  {
    id: 2,
    title: 'Spagetti Frutti Di Mare',
    description:
      'Spaghetti, salmon, sauce with baby squid, shrimps, cream, tomatoes, garlic.',
    image:
      'https://dostavka.happy.bg/remote/files/images/386/fit_600_376.png?rev=0',
  },
  {
    id: 3,
    title: 'Butter Shrimps',
    description:
      'Shrimps with garlic butter, chilli pepper, herbs, bruschettas.',
    image:
      'https://dostavka.happy.bg/remote/files/images/14732/fit_600_376.png?rev=1619460833',
  },
  {
    id: 4,
    title: 'Cesar Salat With Chicken',
    description:
      'Crispy chicken fillet, mixed green salad, crispy bacon, parmesan, croutons, Caesar sauce.',
    image:
      'https://dostavka.happy.bg/remote/files/images/6654/fit_600_376.png?rev=0',
  },
  {
    id: 5,
    title: 'Beef fillets',
    description: 'Roast beef fillet with French fries and mushroom sauce.',
    image:
      'https://dostavka.happy.bg/remote/files/images/6159/fit_600_376.png?rev=0',
  },
  {
    id: 6,
    title: 'Capricciosa',
    description:
      'Prosciutto Cotto, fresh mushrooms, artichoke, olives, mozzarella, aromatic tomato sauce.',
    image:
      'https://dostavka.happy.bg/remote/files/images/17494/fit_600_376.png?rev=1634897736',
  },
];

const App = () => (
  <Container maxWidth="lg">
    <Box
      component="h1"
      textAlign="center"
      bgcolor="#bb2626"
      py={2}
      color="white"
      borderRadius="4px"
    >
      Food delivering
    </Box>
    <Box mt={5} pb={5}>
      <Grid
        container
        spacing={{ xs: 2, md: 6 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {foodList.map(item => (
          <Grid item xs={2} sm={4} md={4} key={item.id}>
            <Card
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

export default App;
