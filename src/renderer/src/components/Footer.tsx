import { JSX } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb'
import { useLocation, Link } from 'react-router-dom'

function Footer(): JSX.Element {
  const location = useLocation()

  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <div className="w-full p-1 flex justify-between px-5">
      <span className="text-sm text-muted-foreground">
        v {window.electron?.process.versions.app || '1.0.0'}
      </span>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {pathnames.length !== 0 ? (
                <Link to="/">Home</Link>
              ) : (
                <p className="select-none">Home</p>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.map((value, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1
            const capitalizedValue = value[0].toLocaleUpperCase() + value.slice(1)
            return (
              <span key={routeTo} className="flex items-center gap-1.5">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{capitalizedValue}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{capitalizedValue}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default Footer
