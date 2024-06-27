/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Layout from 'src/components/Layout/Layout';

import useFetch from 'src/hooks/useFetch';

const Accommodation = () => {
  const posts: Array<any> = useFetch('http://hydehouse.blissology.local:50011/wp-json/wp/v2/accommodation') || [];

  return (
    <Layout>
      <Grid container spacing={2}>
        {posts &&
          posts.map((post: any, index: number) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {post.title.rendered}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {post.content?.rendered}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {post?.acf?.dietary_information}
                  </Typography>
                  {post.post_title}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
};

export default Accommodation;
