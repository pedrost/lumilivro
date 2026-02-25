"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";

import { contactSchema, type ContactFormData } from "@/lib/validators";
import { CONTACT_SUBJECTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      orderNumber: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
    } catch {
      toast({
        title: "Error sending message",
        description:
          "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] pb-16 pt-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="flex flex-col items-center pt-20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-6 font-serif text-2xl font-bold text-white sm:text-3xl"
            >
              Message sent!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-3 text-muted-foreground"
            >
              We will respond within 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-8"
            >
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-white/20 hover:bg-white/5"
              >
                Send another message
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] pb-16 pt-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-muted-foreground">
            Have a question? We are here to help.
          </p>
          <a
            href="mailto:hello@lumi-read.com"
            className="mt-3 inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            hello@lumi-read.com
          </a>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your full name"
              className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus-visible:ring-amber-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus-visible:ring-amber-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">
              Subject
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("subject", value);
                trigger("subject");
              }}
            >
              <SelectTrigger className="border-white/10 bg-white/5 text-white focus:ring-amber-500">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-sm text-red-400">{errors.subject.message}</p>
            )}
          </div>

          {/* Order Number (optional) */}
          <div className="space-y-2">
            <Label htmlFor="orderNumber" className="text-white">
              Order number{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="orderNumber"
              placeholder="Ex: ABC12345"
              className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus-visible:ring-amber-500"
              {...register("orderNumber")}
            />
            {errors.orderNumber && (
              <p className="text-sm text-red-400">
                {errors.orderNumber.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Message
            </Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Describe your question or issue..."
              className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus-visible:ring-amber-500"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-red-400">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full bg-amber-500 text-base font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
