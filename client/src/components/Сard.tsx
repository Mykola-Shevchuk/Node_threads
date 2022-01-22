import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProgressBar from "@ramonak/react-progress-bar";
import 'index.css'

import {BASE_URL} from 'config';

import {FoodItem} from '../App';

type Status = 'init' | 'loading' | 'success' | 'error';

const MediaCard = ({id, title, description, image}: FoodItem) => {
  const [status, setStatus] = useState<Status>('init');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleOrder = (item: FoodItem) => {
    setStatus('loading');
    setMessage('');
    const interval = setInterval(() => {
      fetch(`${BASE_URL}/status/${item.id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(response => {
          console.log(response.progress);
          setMessage(response.status);
          setProgress(response.progress || 0);
        })
        .catch(err => {
            clearInterval(interval);
          });
    }, 700);
    fetch(`${BASE_URL}/order`, {
      method: 'POST',
      body: JSON.stringify({
        id: item.id,
        title: item.title,
        description: item.description,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch(err => {
        setStatus('error');
      })
      .finally(() => {
        setTimeout(() => {
          clearInterval(interval);
          setProgress(0);
          setMessage('');
        }, 2000);
      });
  };

  return (
    <Card sx={{maxWidth: 345}}>
      <CardMedia component="img" height="140" image={image}/>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box width="100%" position="relative" py={2}>
        <Box px={1}>
          <ProgressBar completed={progress} maxCompleted={100} bgColor="green"/>
        </Box>
        <Box display="flex" justifyContent="center" pt={2}>
          <Button
            size="medium"
            variant="contained"
            color="success"
            disabled={status === 'loading'}
            onClick={() => handleOrder({id, title, description, image})}
          >
            {status === 'loading' ? 'Processing by operator' : 'Order now'}
          </Button>
        </Box>
        {message && (
          <Box width="100%" pt={1} position="absolute" left={0} top={-10}>
            <Typography color="#2e7d32" textAlign="center" fontSize={13}>
              {message}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default MediaCard;
