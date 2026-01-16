import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SelectionGallery } from '@/components/gallery/SelectionGallery'
import { ReviewGallery } from '@/components/gallery/ReviewGallery'
import { DeliveryView } from '@/components/gallery/DeliveryView'
import { Project, ClientData, ProjectAssets } from '@/types/database'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch project data
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Parse JSONB fields with proper type casting
  const rawClientData = project.client_data as unknown
  const clientData: ClientData = (rawClientData && typeof rawClientData === 'object' && 'selection_manifest' in rawClientData)
    ? rawClientData as ClientData
    : { selection_manifest: [], revision_history: [] }

  const rawAssets = project.assets as unknown
  const assets: ProjectAssets = (rawAssets && typeof rawAssets === 'object')
    ? rawAssets as ProjectAssets
    : {}

  // Generate placeholder images for demo (replace with actual WebDAV fetch in production)
  const generatePlaceholderImages = (count: number, seed: string) => {
    return Array.from({ length: count }, (_, i) => ({
      filename: `IMG_${String(i + 1).padStart(4, '0')}.jpg`,
      url: `https://picsum.photos/seed/${seed}${i}/800/600`
    }))
  }

  // Generate images for Stage 1 selection
  const selectionImages = generatePlaceholderImages(24, 'preview')

  // Generate images for Stage 3 delivery (with id field required by DeliveryView)
  const deliveryImages = generatePlaceholderImages(
    clientData.selection_manifest.length || 10,
    'final'
  ).map((img, i) => ({
    ...img,
    id: `final-${i}`
  }))

  return (
    <div className="min-h-screen">
      {/* Project Header */}
      <div className="bg-white border-b border-lavender-100 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl text-charcoal-800">
              {project.child_name || project.title}
            </h1>
            {project.occasion && (
              <p className="text-charcoal-500 mt-1 capitalize">
                {project.occasion} Session
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-charcoal-400">Package</p>
            <p className="font-semibold text-lavender-700">
              {project.package_limit} Photos
            </p>
          </div>
        </div>
      </div>

      {/* Stage-based Content */}
      <div className="p-8">
        {project.current_stage === 1 && (
          <SelectionGallery
            project={project as Project}
            images={selectionImages}
            clientData={clientData}
          />
        )}

        {project.current_stage === 2 && (
          <ReviewGallery
            projectId={project.id}
            assets={assets}
            clientData={clientData}
          />
        )}

        {project.current_stage === 3 && (
          <DeliveryView
            currentStage={project.current_stage}
            finalUrl={assets.final_url}
            images={deliveryImages}
            childName={project.child_name || undefined}
            projectTitle={project.title}
          />
        )}
      </div>
    </div>
  )
}
