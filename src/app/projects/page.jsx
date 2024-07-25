import Footer from '@/components/Footer'
import Header from '@/components/Header'
import AnimatedCursor from 'react-animated-cursor'
import '../../utils/preventSelect.css'
import AllProjects from '@/components/pages/projects/AllProjects'

const page = () => {
  return (
    <div className="prevent-select">
      <AnimatedCursor
        innerSize={8}
        outerSize={8}
        color="58,234,0"
        outerAlpha={0.2}
        innerScale={0.9}
        outerScale={8}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
        ]}
      />

      <Header />
      <AllProjects />
      <Footer />
    </div>
  )
}

export default page
