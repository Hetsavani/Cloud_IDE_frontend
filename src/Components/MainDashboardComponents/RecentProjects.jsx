import { motion } from "framer-motion"
import { FiFolder, FiClock } from "react-icons/fi"

const RecentProjects = () => {
  const projects = [
    { name: "E-commerce Platform", lastEdited: "2 hours ago" },
    { name: "Task Management App", lastEdited: "1 day ago" },
    { name: "Portfolio Website", lastEdited: "3 days ago" },
    { name: "Weather Forecast API", lastEdited: "1 week ago" },
  ]

  return (
    <section id="recent-projects" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-900 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-3xl text-cyan-500">
          <FiFolder />
        </motion.div>
        <div className="flex items-center text-sm text-gray-400">
          <FiClock className="mr-1" />
          {project.lastEdited}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Open Project
      </motion.button>
    </motion.div>
  )
}

export default RecentProjects

