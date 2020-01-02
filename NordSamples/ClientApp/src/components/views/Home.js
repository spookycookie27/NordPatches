import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const Home = () => {
  return (
    <div className='Home'>
      <Container maxWidth='md'>
        <Typography variant='h2' gutterBottom>
          Welcome To The (Unofficial) Nord Sample Library
        </Typography>
        <Typography variant='body1' gutterBottom>
          <i>
            This website contains searchable metadata that references user contributed samples, programs and patches found at the Nord User Form
            (norduserforum.com).
          </i>
        </Typography>
        <Typography variant='body1' gutterBottom>
          Part of the appeal of Nord keyboards is being able to play samples from almost any source. While Nord provides an impressive library of free samples
          on their official website, Nord users have been creating and sharing their own samples, patches and programs on the Nord User Forum for many years.
        </Typography>
        <Typography variant='body1' gutterBottom>
          Over time, the collection of sounds posted on the Nord User Forum has become more difficult to use. Searching could be frustrating, sounds weren’t
          categorized in any standard way, and similar.
        </Typography>
        <Typography variant='body1' gutterBottom>
          A while back, one of the forum members (“spookycookie”) took it upon himself to create a better tool for organizing samples, patches and programs for
          various Nord keyboards – while still preserving the original user posts on the Nord User Forum. This means most files featured on this site will
          likely still reside at the Nord User Forum (however some newer patches might have been added directly on this site). This website should help you find
          what you’re looking with far less effort.
        </Typography>
        <Typography variant='h5' gutterBottom>
          A Few Terms And Concepts
        </Typography>
        <Typography variant='body1' gutterBottom>
          The Nord documentation refers to 'programs' as a saved preset consisting of some combination of sampled sounds, programmed sounds (think organ and
          synth), as well as desired effects, filtering and more. Many people also use the term 'patch' to describe the same concept.
        </Typography>
        <Typography variant='body1' gutterBottom>
          Nord sound samples come in two primary flavors: 'piano' samples and all others. The 'piano' samples are multi-layered and are proprietary to Nord.
          They include grand and upright pianos, electric pianos and clavinets, marimba and xylophone, harpsichord and several other classic keyboard sounds.
          Only Nord can create these samples. You can find these on the official Nord website.
        </Typography>
        <Typography variant='body1' gutterBottom>
          By comparison, all other samples (flute, strings, etc.) are simpler. Anyone can create and load their own samples using the software tools provided by
          Nord.
        </Typography>
        <Typography variant='body1' gutterBottom>
          A 'program' or 'patch' often requires one or more samples to be loaded into the keyboard to work properly. If you load a sample that doesn’t have an
          associated program or patch file, you’ll want to create your own using your keyboard controls. See Nord’s excellent documentation if you’re not
          familiar with how to do this.
        </Typography>
        <Typography variant='body1' gutterBottom>
          If you’re not familiar with the Nord Sound Manager and the Nord Sample Editor, you can find them here:{' '}
          <a href='https://www.nordkeyboards.com/software-tools'>https://www.nordkeyboards.com/software-tools</a>
        </Typography>
        <Box my={2}>
          <img src='/Images/sample-editor.png' width='100%' alt='nord sample editor' />
        </Box>
        <Typography variant='h5' gutterBottom>
          How To Use This Search Tool
        </Typography>
        <Typography variant='body1' gutterBottom>
          The best place to start is by creating a free user account at the Nord User Forum (<a href='https://norduserforum.com'>norduserforum.com</a>). Once
          you do so, you’ll see an activation code on your user control panel under the 'profile' tab.
        </Typography>
        <Box my={2}>
          <img src='/Images/forum.png' width='100%' alt='notd user form user control panel' />
        </Box>
        <Typography variant='body1' gutterBottom>
          When you register here, please enter your activation code. We use this code to establish a linkage between users on this website and owners of source
          files on the Nord User Forum.
        </Typography>
        <Typography variant='h5' gutterBottom>
          Work In Progress – Volunteers Needed!
        </Typography>
        <Typography variant='body1' gutterBottom>
          The current collection has over a thousand posts that each need to be classified, and in many cases improved. For example, we encourage users posting
          samples to include a short mp3 recording of what the sample sounds like. Many useful samples don’t have this, and it’s something we’d like to fix over
          time.
        </Typography>
        <Typography variant='body1' gutterBottom>
          Better yet, volunteer to help! See{' '}
          <a href='https://www.norduserforum.com/nord-user-samples-nsmp-samples-f14/nord-user-sample-library-development-thread-t18694.html'>this post.</a>
        </Typography>
        <Typography variant='body1' gutterBottom>
          <i>
            Donations are used to cover the development and running costs of the site. If you wish to donate to this initiative please send your contribution
            via paypal below.
          </i>
        </Typography>
        <Box>
          <form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top' style={{ textAlign: 'center' }}>
            <input type='hidden' name='cmd' value='_s-xclick' />
            <input type='hidden' name='hosted_button_id' value='2HNTWYD49HXBW' />
            <input
              type='image'
              src='https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif'
              border='0'
              name='submit'
              title='PayPal - The safer, easier way to pay online!'
              alt='Donate with PayPal button'
            />
            <img alt='' border='0' src='https://www.paypal.com/en_GB/i/scr/pixel.gif' width='1' height='1' />
          </form>
        </Box>
        <Typography variant='h5' gutterBottom>
          Disclaimers
        </Typography>
        <Typography variant='body1' gutterBottom>
          This website (as well as the Nord User Forum) is a community resource and not affiliated with Clavia (Nord) in any way. The tools and the files they
          access are provided without guarantee or warranty of any kind, so please use at your own risk.
        </Typography>
        <Typography variant='body1' gutterBottom>
          Certain vendors discourage sampling of their products, please check before uploading a sample.
        </Typography>
        <Typography variant='h5' gutterBottom>
          Questions? Comments?
        </Typography>
        <Typography variant='body1' gutterBottom>
          The best way to communicate is via the Nord User Forum. Post a message, and someone will likely get back to you quickly.
        </Typography>
      </Container>
    </div>
  );
};
export default Home;
