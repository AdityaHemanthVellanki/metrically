"use client"

import { 
  BarChart4, 
  BrainCircuit, 
  Code2, 
  Database, 
  LineChart,
  ShieldCheck,
  SparklesIcon,
  Layers
} from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesWaitlist() {
  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: "AI-Generated KPIs",
      description: "Get custom KPI recommendations tailored to your specific business model, industry, and stage of growth."
    },
    {
      icon: <LineChart className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: "Visualization Suggestions",
      description: "For each KPI, receive recommendations on the most effective visualization type to best communicate the data."
    },
    {
      icon: <Database className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: "Data Integration",
      description: "Seamlessly connect to your existing data sources to extract the right information for your KPIs."
    },
    {
      icon: <Code2 className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: "Tech Stack Integration",
      description: "Metrically adapts to your existing technology stack for seamless implementation."
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: "Custom Analytics",
      description: "Create bespoke analytics views that focus on the metrics that matter most to your team."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      title: "Secure Architecture",
      description: "Built with enterprise-grade security to keep your business data safe and protected."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="py-32 relative" id="features">
      {/* Background with subtle grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-900/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 font-sans tracking-tight">
            Powerful AI-Driven Analytics Platform
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Metrically is being built to transform how startups track, analyze, and act on their most important metrics.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-8 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center mb-6 border border-indigo-500/20 dark:border-indigo-400/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
