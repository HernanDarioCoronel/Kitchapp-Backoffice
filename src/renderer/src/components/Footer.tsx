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
    <Breadcrumb className="bg-green-100 w-full p-1 flex justify-end pr-5">
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
          return (
            <span key={routeTo} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{value}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo}>{value}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Footer
