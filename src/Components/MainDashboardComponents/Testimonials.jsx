import { motion } from "framer-motion"
import { FiUser } from "react-icons/fi"

const Testimonials = () => {
  const testimonials = [
    {
      quote: "CodeVortex has revolutionized my development workflow. No more heavy editors or complicated setups!",
      author: "Sarah Johnson, Full Stack Developer",
    },
    {
      quote: "The built-in online compiler is a game-changer. I can code and test from anywhere, on any device.",
      author: "Mike Chen, Software Engineer",
    },
    {
      quote: "The code from photo feature is brilliant! It's saved me hours of transcribing handwritten notes.",
      author: "Emily Rodriguez, Computer Science Student",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center mb-4">
        <FiUser className="text-2xl text-cyan-500 mr-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.author}</p>
      </div>
      <p className="text-gray-800 dark:text-gray-200 italic">"{testimonial.quote}"</p>
    </motion.div>
  )
}

export default Testimonials

