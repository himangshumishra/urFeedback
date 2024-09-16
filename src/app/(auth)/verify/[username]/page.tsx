'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const VerifyAccount = () => {
    const router=useRouter()
    const params=useParams<{username:string}>()
    const {toast}=useToast()

    const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        }
    )
    const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
        try {
           const response= await axios.post(`/api/verify-code`,{
                username:params.username,
                code:data.code
            })
            toast({
                title:"Success",
                description:response.data.message,
            })
            router.push('/sign-in')
        } catch (error:any) {
            toast({
                title:"Error",
                description:error.response.data.message,
        })
    }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
  <div className="w-full max-w-md p-8 space-y-8 m-4 border bg-gray-900 rounded-lg shadow-lg transform transition-all hover:scale-100">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">
        Verify Your Account
      </h1>
      <p className="text-gray-400 mb-4">Enter the verification code sent to your email</p>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Verification Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Code"
                  {...field}
                  className="bg-gray-800 border border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-colors"
        >
          Submit
        </Button>
      </form>
    </Form>
  </div>
</div>

  )

}

export default VerifyAccount