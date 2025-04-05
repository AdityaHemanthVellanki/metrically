"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"

export function FaqWaitlist() {
  const faqs = [
    {
      question: "What is Metrically?",
      answer: "Metrically is an AI-powered platform that helps startups build and track the perfect KPI system. It automatically generates key performance indicators tailored to your business model, industry, and stage of growth, along with SQL queries and visualization recommendations."
    },
    {
      question: "When will Metrically launch?",
      answer: "We're currently in the final stages of development and plan to launch in Q3 2025. By joining the waitlist, you'll be notified as soon as we're ready and will get priority access."
    },
    {
      question: "Is there a cost to join the waitlist?",
      answer: "No, joining the waitlist is completely free. After launch, we'll offer both free and premium plans, with special early-bird pricing for waitlist members."
    },
    {
      question: "What technologies does Metrically integrate with?",
      answer: "Metrically is designed to work with a wide range of databases and analytics tools. We're building integrations with popular tools like Segment, Mixpanel, and Google Analytics to ensure seamless connectivity with your existing tech stack."
    },
    {
      question: "Do I need technical expertise to use Metrically?",
      answer: "Not at all! Metrically is designed for both technical and non-technical users. Our AI handles the complexity of generating appropriate KPIs and queries, while providing an intuitive interface for all team members."
    },
    {
      question: "How is my data handled?",
      answer: "We take data security seriously. All data is encrypted both in transit and at rest. We don't store your actual database data - Metrically generates the queries and visualization recommendations, but the actual data remains within your systems."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-32 relative" id="faq">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/30 dark:from-black dark:to-indigo-950/10">
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
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-16 w-16 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center border border-indigo-500/20 dark:border-indigo-400/20"
            >
              <HelpCircle className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 font-sans tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Got questions about Metrically? We've got answers.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="border-b border-slate-200/70 dark:border-slate-700/70 last:border-0">
                  <AccordionTrigger className="text-left font-semibold text-lg py-5 text-slate-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 text-base leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
