// src/components/ContactForm.tsx
"use client"
import { useState } from 'react'
import Image from 'next/image'

interface ContactFormData {
  firstName: string
  phone: string
  email: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  return (
    <div
  className="flex w-[95%] h-full justify-center items-center bg-[url('/Subtract.svg')] bg-contain bg-center bg-no-repeat p-0"
>
        
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-[5.2%] items-center py-0 px-[4.3%] pb-[4.3%]">
        
        {/* Contact Form */}
        <div className="h-[88%] flex flex-col justify-between">
          <div className=''>
          {/* Header */}
          <div className="flex items-center justify-between mb-16 pl-[3%] pr-[3%]">
            
              <h2 className="text-[#1C4B24] text-[40px] font-medium">Connectons-nous</h2>
            
            
            <div className="w-[55px] h-[55px] bg-gradient-to-br from-[#61B989] to-[#1C4B24] rounded-[10px] flex items-center justify-center -mt-[2%]">
              <Image 
                src="/email.svg" 
                alt="Email Icon" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="E.g Johan"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FCFDFB] rounded-[13px] border-none outline-none text-gray-600 placeholder-gray-400 focus:bg-opacity-100 transition-all"
              />
              <input
                type="tel"
                name="phone"
                placeholder="+33 698752315"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FCFDFB] rounded-[13px] border-none outline-none text-gray-600 placeholder-gray-400 focus:bg-opacity-100 transition-all"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Johan22@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#FCFDFB] rounded-[13px] border-none outline-none text-gray-600 placeholder-gray-400 focus:bg-opacity-100 transition-all"
            />

            {/* Message */}
            <textarea
              name="message"
              placeholder="Saisiesser votre message ..........."
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#FCFDFB] rounded-[13px] border-none outline-none text-gray-600 placeholder-gray-400 focus:bg-opacity-100 transition-all resize-none"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="shiny-button w-full bg-gradient-to-r from-[#D7F781] to-[#61B989] text-xl text-[#1C4B24] font-medium h-[45px] pl-6 pr-2 rounded-full transition-all duration-300 flex items-center justify-between group"
            >
              <span>Envoyer</span>
              <div className="w-[34px] h-[34px] flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                <Image 
                  src="/arrow-right.svg" 
                alt="Email Icon" 
                width={34} 
                height={34}
                className="w-[34px] h-[34px]"
                />
                  
              </div>
            </button>
          </form>
</div>
          {/* Contact Info */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-[#D7F781]">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image 
                  src="/emailGreen.svg" 
                alt="Email Icon" 
                width={32} 
                height={32}
                className="w-8 h-8"
                />
              </div>
              <span className="text-xl text-[#F1ECE5] font-light">Agence@vertiqual.net</span>
            </div>
            
            <div className="flex items-center gap-3 text-[#D7F781]">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image 
                  src="/call.svg" 
                alt="Call Icon" 
                width={32} 
                height={32}
                className="w-8 h-8"
                />
              </div>
              <span className="text-xl text-[#F1ECE5] font-light">07 56 95 52 86 - 06 59 14 91 38</span>
            </div>
          </div>
        </div>

        {/* Right Side - Logo */}
        <div className="w-full flex flex-col items-center justify-around h-[88%]">
          
            <div className="h-full w-full flex items-start justify-end pt-[5%] -mr-[6%]">
              <Image 
                  src="/linkedInGreen.svg" 
                alt="LinkedIn" 
                width={30} 
                height={30}
                className="w-[30px] h-[30px] object-cover"
                />
              </div>
              <div className='h-full w-full flex justify-end items-end'>
              <Image 
                  src="/vertiqualLogoGreen.svg" 
                alt="VertiQual logo" 
                width={260} 
                height={52}
                className="w-[260px] h-[52px] object-cover"
                />
                </div>
            </div>
          </div>
        </div>
      
   
  )
}
