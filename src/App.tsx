import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { LeftSidebar } from './components/LeftSidebar'
import { RightSidebar } from './components/RightSidebar'
import { LeftSidebarDrawer } from './components/LeftSidebarDrawer'
import { RightSidebarDrawer } from './components/RightSidebarDrawer'
import { ResearchSection } from './components/ResearchSection'
import { FieldSection } from './components/FieldSection'
import { GroupsPage } from './components/GroupsPage'
import { ResourceLibrary } from './components/ResourceLibrary'
import { UsageGuide } from './components/UsageGuide'
import { SiteStructure } from './components/SiteStructure'
import { Toaster } from './components/ui/sonner'
import type { Section, Post, Resource, Group } from './lib/types'

type Page = 'home' | 'groups' | 'resources' | 'guide' | 'structure'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [activeSection, setActiveSection] = useState<Section>('research')
  const [posts] = useKV<Post[]>('posts', [])
  const [resources] = useKV<Resource[]>('resources', [])
  const [groups] = useKV<Group[]>('groups', [])
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

  const handleNavigate = (page: Page, section?: Section) => {
    setCurrentPage(page)
    if (section) setActiveSection(section)
    setLeftDrawerOpen(false)
    setRightDrawerOpen(false)
  }

  const renderMainContent = () => {
    if (currentPage === 'groups') {
      return <GroupsPage groups={groups || []} />
    }
    
    if (currentPage === 'resources') {
      return <ResourceLibrary resources={resources || []} />
    }

    if (currentPage === 'guide') {
      return <UsageGuide onNavigate={(page) => handleNavigate(page)} />
    }

    if (currentPage === 'structure') {
      return <SiteStructure />
    }

    return (
      <div className="flex gap-6">
        <LeftSidebar />
        
        <main className="flex-1 min-w-0">
          {activeSection === 'research' ? (
            <ResearchSection posts={(posts || []).filter(p => p.section === 'research')} />
          ) : (
            <FieldSection posts={(posts || []).filter(p => p.section === 'field')} />
          )}
        </main>

        <RightSidebar posts={posts || []} groups={groups || []} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section)
          setCurrentPage('home')
        }}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onLeftDrawerOpen={() => setLeftDrawerOpen(true)}
        onRightDrawerOpen={() => setRightDrawerOpen(true)}
      />
      
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {renderMainContent()}
      </div>

      <LeftSidebarDrawer 
        open={leftDrawerOpen} 
        onOpenChange={setLeftDrawerOpen}
      />
      
      <RightSidebarDrawer 
        open={rightDrawerOpen} 
        onOpenChange={setRightDrawerOpen}
        posts={posts || []}
        groups={groups || []}
      />

      <Toaster />
    </div>
  )
}

export default App
