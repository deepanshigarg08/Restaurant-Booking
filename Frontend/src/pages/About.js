import Head from 'next/head';
import styles from '../styles/About.module.css';
import Layout from './Layout';

const About = () => {
  return (
   <Layout>
    <>
      <Head>
        <title>About Me</title>
        <meta name="description" content="Learn more about Bhuvan Tenguria, a passionate Full Stack Developer with a strong background in technology and coding." />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>About Me</h1>
        </div>
        
        <div className={styles.content}>
          <section className={styles.introduction}>
            <p>
              Hi, I'm <strong>Bhuvan Tenguria</strong>! I am pursuing my <strong>Bachelor of Technology in Computer Science</strong> from <strong>GLA University, Mathura</strong>. My journey in the tech world has been fueled by a passion for problem-solving, coding, and creating impactful software solutions.
            </p>
            <p>
              I had the opportunity to intern at <strong>Coding Blocks</strong> during the summer of 2023, where I contributed to the platform's community by solving over 250+ coding challenges, enhancing my problem-solving skills, and actively participating in collaborative coding sessions.
            </p>
            <p>
              My technical journey led me to work on multiple real-world projects. Notably, I built a comprehensive <strong>Job Portal</strong> using technologies like <strong>Next.js, MongoDB, Supabase, Node.js, Clerk Auth, and Tailwind CSS</strong>, offering robust solutions for job seekers and recruiters.
            </p>
            <p>
              In addition, I developed an <strong>e-commerce shopping website</strong> featuring a seamless user interface and secure payment gateways using <strong>React.js, Redux, Node.js, Express, and MongoDB</strong>. This platform enabled users to buy and sell products efficiently, handling hundreds of users simultaneously.
            </p>
            <p>
              My passion for technology extends beyond just coding; I enjoy solving complex problems and continuously enhancing my skills in <strong>Data Structures, Algorithms, and Full Stack Development</strong>. 
            </p>
            <p>
              I am eager to contribute my skills and experiences to a dynamic team where I can continue to grow as a developer.
            </p>
          </section>

          <section className={styles.portfolio}>
            <p>
              You can view my work and learn more about my projects on my <a href="https://bhuvantenguria.github.io/bhuvan/" target="_blank" rel="noopener noreferrer"><strong>Portfolio</strong></a>.
            </p>
          </section>
        </div>
      </div>
    </>
   </Layout>
  );
};

export default About;
