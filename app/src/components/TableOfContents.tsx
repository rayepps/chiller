import clsx from 'clsx'
import { Fragment, useContext } from 'react'
import config from 'src/config'
import { SidebarContext } from 'src/state'
import type { TableOfContentsItem, TableOfContentsList } from 'src/types'
import { twMerge } from 'tailwind-merge'

export function TableOfContents({
  tableOfContents,
  currentSection
}: {
  tableOfContents: TableOfContentsList
  currentSection: string
}) {
  let sidebarContext = useContext(SidebarContext) as any
  let isMainNav = Boolean(sidebarContext)

  function closeNav() {
    if (isMainNav) {
      sidebarContext.setNavIsOpen(false)
    }
  }

  function isActive(section: TableOfContentsItem) {
    if (section.slug === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  let pageHasSubsections = tableOfContents.some(
    section => section.children.length > 0
  )

  return (
    <>
      <div className="px-8">
        <h5 className="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
          On this page
        </h5>
        <ul className="text-slate-700 text-sm leading-6">
          {tableOfContents.map(section => (
            <Fragment key={section.slug}>
              <li>
                <a
                  href={`#${section.slug}`}
                  onClick={closeNav}
                  data-is-selected={isActive(section) ? 'true' : 'false'}
                  className={twMerge(
                    clsx(
                      'block py-1',
                      pageHasSubsections ? 'font-medium' : '',
                      'data-selected:font-medium hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                    ),
                    config.theme?.['toc.section.title'] ?? ''
                  )}
                >
                  {section.title}
                </a>
              </li>
              {section.children.map(subsection => (
                <li
                  className="ml-4"
                  key={subsection.slug}
                >
                  <a
                    href={`#${subsection.slug}`}
                    onClick={closeNav}
                    data-is-selected={isActive(subsection) ? 'true' : 'false'}
                    className={twMerge(
                      clsx(
                        'group flex items-start py-1 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                      ),
                      config.theme?.['toc.section.title'] ?? ''
                    )}
                  >
                    <svg
                      width="3"
                      height="24"
                      viewBox="0 -9 3 24"
                      className="mr-2 text-slate-400 overflow-visible group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500"
                    >
                      <path
                        d="M0 0L3 3L0 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {subsection.title}
                  </a>
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
    </>
  )
}
