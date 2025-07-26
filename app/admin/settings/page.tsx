"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Loader2, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

interface Settings {
  logoUrl: string
  primaryColor: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({ logoUrl: "", primaryColor: "59 130 246" })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${getCookie("admin-token")}`,
        },
      })

      if (response.status === 401) {
        router.push("/admin/login")
        return
      }

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setLogoPreview(data.logoUrl)
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "সেটিংস লোড করতে সমস্যা হয়েছে",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return ""
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Logo upload failed")
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      let logoUrl = settings.logoUrl

      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
      }

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("admin-token")}`,
        },
        body: JSON.stringify({
          logoUrl,
          primaryColor: settings.primaryColor,
        }),
      })

      if (response.ok) {
        // Update CSS variables
        document.documentElement.style.setProperty("--primary-color", settings.primaryColor)

        toast({
          title: "সফল",
          description: "সেটিংস সংরক্ষিত হয়েছে",
        })
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const colorPresets = [
    { name: "নীল", value: "59 130 246" },
    { name: "সবুজ", value: "34 197 94" },
    { name: "লাল", value: "239 68 68" },
    { name: "বেগুনি", value: "147 51 234" },
    { name: "গোলাপি", value: "236 72 153" },
    { name: "কমলা", value: "249 115 22" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ড্যাশবোর্ডে ফিরুন
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">সেটিংস</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                সাইট লোগো
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {logoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="mx-auto h-24 w-auto object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setLogoFile(null)
                        setLogoPreview("")
                      }}
                    >
                      লোগো পরিবর্তন করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <Label htmlFor="logo" className="cursor-pointer">
                        <span className="text-blue-600 font-medium">লোগো নির্বাচন করুন</span>
                        <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG বা SVG (সর্বোচ্চ 2MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                প্রাথমিক রঙ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, primaryColor: color.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.primaryColor === color.value
                        ? "border-gray-900 ring-2 ring-gray-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full h-8 rounded mb-2" style={{ backgroundColor: `rgb(${color.value})` }}></div>
                    <p className="text-sm font-medium">{color.name}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customColor">কাস্টম রঙ (RGB ভ্যালু)</Label>
                <Input
                  id="customColor"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="59 130 246"
                />
                <p className="text-sm text-gray-500">উদাহরণ: 59 130 246 (নীল রঙের জন্য)</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">প্রিভিউ:</p>
                <Button
                  type="button"
                  style={{ backgroundColor: `rgb(${settings.primaryColor})` }}
                  className="text-white"
                >
                  নমুনা বাটন
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="px-8">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                "সেটিংস সংরক্ষণ করুন"
              )}
            </Button>
          </div>
        </form>
      </main>
      <Toaster />
    </div>
  )
}
