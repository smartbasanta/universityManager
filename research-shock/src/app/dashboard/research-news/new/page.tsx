 "use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import RichTextEditor from "@/components/text-editor";
import { useAddResearchNews } from "@/hooks/api/research/research.query";
import { toast } from "react-toastify";


export default function ResearchNewsDetails() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [featuredImage, setFeaturedImageUrl] = useState("");
  const [youtubeUrl, setYoutubeLink] = useState("");
  const [article, setArticle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]); 
  const [paperLink, setPaperLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const { mutate: addResearchNews, isPending: isSaving } = useAddResearchNews();


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    setIsUploading(true);
    setUploadError("");
    
    try {
      // Create preview URL for immediate display
      const fileUrl = URL.createObjectURL(file);
      setFeaturedImageUrl(fileUrl);
      
      // Store the actual file object for form submission
      setSelectedFile(file);
      
      console.log("File selected:", file.name);
      toast.success("Image selected successfully!");
      
    } catch (error) {
      console.error('File selection failed:', error);
      setUploadError('Failed to select image. Please try again.');
      toast.error('Failed to select image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };


  const handlePreview = () => {
    console.log("Preview clicked");
    toast.info("Preview functionality coming soon!");
    // Handle preview logic here
  };


  const resetForm = () => {
    setTitle("");
    setAbstract("");
    setFeaturedImageUrl("");
    setYoutubeLink("");
    setArticle("");
    setCategory("");
    setTags([]);
    setPaperLink("");
    setUploadError("");
    setIsUploading(false);
    setSelectedFile(null);
  };


  const handleSaveDraft = () => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('youtubeUrl', youtubeUrl);
    formData.append('article', article);
    formData.append('category', category);
    tags.forEach(tag => formData.append('tags[]', tag));


    formData.append('paperLink', paperLink);
    formData.append('status', 'draft');
    
    // Add the file if selected
    if (selectedFile) {
      formData.append('featuredImage', selectedFile);
    }
    
    addResearchNews(formData, {
      onSuccess: () => {
        console.log("Draft saved successfully");
        toast.success("Draft saved successfully!");
        resetForm();
      },
      onError: (error) => {
        console.error("Failed to save draft:", error);
        toast.error("Failed to save draft. Please try again.");
      }
    });
  };


  const handleSubmit = () => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('youtubeUrl', youtubeUrl);
    formData.append('article', article);
    formData.append('category', category);
    tags.forEach(tag => formData.append('tags[]', tag));


    formData.append('paperLink', paperLink);
    formData.append('status', 'published');
    
    // Add the file if selected
    if (selectedFile) {
      formData.append('featuredImage', selectedFile);
    }
    
    addResearchNews(formData, {
      onSuccess: () => {
        console.log("Research news published successfully");
        toast.success("Research news published successfully!");
        resetForm();
      },
      onError: (error) => {
        console.error("Failed to publish research news:", error);
        toast.error("Failed to publish research news. Please try again.");
      }
    });
  };


  return (
    <div className="flex flex-col p-4">
      <h1 className="text-[#111418] text-3xl font-bold leading-tight mb-6">
        Research News Details
      </h1>


      <form className="space-y-6 max-w-3xl">
        {/* News Title */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            News Title *
          </label>
          <Input
            placeholder="Enter research news title"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>


        {/* Research Abstract */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Research Abstract *
          </label>
          <Textarea
            placeholder="Enter the research abstract"
            className="bg-[#f0f2f5] border-none min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </div>


        {/* Featured Image Upload */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Featured Image *
          </label>
          <Input
            type="file"
            accept="image/*"
            className="bg-[#f0f2f5] border-none p-3"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          
          {/* Upload Status */}
          {isUploading && (
            <p className="text-sm text-blue-500 mt-2">
              Processing image...
            </p>
          )}
          
          {/* Upload Error */}
          {uploadError && (
            <p className="text-sm text-red-500 mt-2">
              {uploadError}
            </p>
          )}
          
          {/* Image Preview and Info */}
          {featuredImage && !uploadError && (
            <div className="mt-2">
              <p className="text-sm text-green-600 mb-2">
                ✅ Image selected: {selectedFile?.name}
              </p>
              
              {/* Image Preview */}
              <img 
                src={featuredImage} 
                alt="Featured image preview" 
                className="max-w-xs max-h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>


        {/* YouTube Link */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Narration Video (YouTube Link)
          </label>
          <Input
            placeholder="Paste YouTube URL"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={youtubeUrl}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>


        {/* News Article Editor */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            News Article *
          </label>
          <RichTextEditor
            value={article}
            onChange={setArticle}
          />
          <p className="text-gray-500 text-sm mt-2">
            Write or paste the full article here. Use the toolbar to format your content.
          </p>
        </div>


        {/* Research Category */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Research Category *
          </label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">Artificial Intelligence</SelectItem>
              <SelectItem value="aerospace">Aerospace Engineering</SelectItem>
              <SelectItem value="health">Health & Medicine</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
              <SelectItem value="quantum">Quantum Computing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* Tags / Keywords using TagInput */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Tags / Keywords
          </label>
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder="Add tags (e.g., space, propulsion, AI ethics)"
          />
          <p className="text-gray-500 text-sm mt-2">
            Enter keywords related to your research. Press Enter or comma to add each tag.
          </p>
        </div>


        {/* Paper Link */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Link to Research Paper
          </label>
          <Input
            placeholder="Link to the full research paper"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={paperLink}
            onChange={(e) => setPaperLink(e.target.value)}
          />
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            className="bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]/90 h-10"
            disabled={isUploading}
          >
            Preview
          </Button>
             <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving || !title.trim() || !abstract.trim() || !article.trim() || !category}
            className="bg-[#0c77f2] text-white hover:bg-[#0c77f2]/90 h-10"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !title.trim() || !abstract.trim() || !article.trim() || !category}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isSaving ? "Publishing..." : "Submit News"}
          </Button>
        </div>
      </form>
    </div>
  );
}