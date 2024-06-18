import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useFetch from 'hooks/useFetch';

const Posts = () => {
  const posts: Array<any> = useFetch('http://hydehouse.blissology.local:50011/wp-json/wp/v2/menu') || [];


  
  return (
    <Grid container spacing={2}>
      {posts &&
        posts.map((post: any, index: number) => (
          <Grid item xs={4} key={index}>
            <Card>
              <CardContent>
                <Typography
                  color='textSecondary'
                  gutterBottom
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <Typography
                  variant='body2'
                  component='p'
                  dangerouslySetInnerHTML={{ __html: post.content?.rendered }}
                />
                <Typography
                  variant='body2'
                  component='p'
                  dangerouslySetInnerHTML={{ __html: post?.acf?.dietary_information }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default Posts;
