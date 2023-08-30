import { Location, Menu, MenuItem } from "@prisma/client";

type MenuWithItemsAndLocation = Menu & { items: MenuItem[] } & {
  location: Location;
};

export default function Menu({ menu }: { menu: MenuWithItemsAndLocation }) {
  return (
    <li
      className="rounded bg-slate-100 p-4 shadow-md dark:bg-slate-800"
      key={menu.id}
    >
      <h2 className="mb-5 text-2xl font-bold">{menu.location.name}</h2>
      <ul className="flex flex-col">
        {menu.items.map((item, index) => (
          <li key={item.id}>
            <span className="text-md">{item.name}</span>
            {item.price && (
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {item.price} €
              </span>
            )}
            {menu.items.length !== index + 1 && (
              <hr className="my-2 border-t border-t-slate-500" />
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}