/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Layout from 'src/components/Layout/Layout';

import useFetch from 'src/hooks/useFetch';

const Accommodation = () => {
  const posts: Array<any> =
    useFetch('http://hydehouse.blissology.local:50011/wp-json/wp/v2/accommodation?_embed=wp:term&_fields=id,title,_links,_embedded,acf&per_page=100&orderby=title') || [];

  return (
    <Layout title="Accommodation">
      <Grid container spacing={2}>
        {posts &&
          posts
            .slice()
            .sort((a, b) => (a.title > b.title ? 1 : -1))
            .map((post: any, index: number) => (
              <Grid item xs={4} key={index}>
                <Card>
                  <Typography color="textSecondary" gutterBottom>
                    {post.title.rendered}
                  </Typography>
                  <Typography variant="body1">{post.content?.rendered}</Typography>
                  <Typography variant="body1">{post?.acf?.dietary_information}</Typography>
                  {post.post_title}
                </Card>
              </Grid>
            ))}
      </Grid>
    </Layout>
  );
};

export default Accommodation;
