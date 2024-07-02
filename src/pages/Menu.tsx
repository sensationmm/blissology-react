/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Layout from 'src/components/Layout/Layout';

import useFetch from 'src/hooks/useFetch';

const Menu = () => {
  const posts: Array<any> = useFetch('http://hydehouse.blissology.local:50011/wp-json/wp/v2/menu?_embed=wp:term&_fields=id,title,_links,_embedded,acf') || [];

  return (
    <Layout>
      <Grid container spacing={2} className="cards">
        {posts &&
          posts.map((post: any, index: number) => (
            <Grid item xs={3} key={index}>
              <Card>
                <Typography color="textSecondary" gutterBottom>
                  {post.title.rendered}
                </Typography>
                <Typography variant="body1">{post.acf?.description}</Typography>
                <Typography variant="body1">{post?.acf?.dietary_information}</Typography>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
};

export default Menu;
