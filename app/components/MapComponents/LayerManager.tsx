// LayerManager.tsx
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { useLayerFilter } from "./LayerFilterContext";
import { PoiAcceptanceStatus, PoiCategory, PoiPriority } from "@/types/poi";
import { RoadtripMember } from "@/types/roadtripMember";

interface LayerManagerProps {
  members?: RoadtripMember[];
  onClose?: () => void;
}

export default function LayerManager({
  members = [],
  onClose,
}: LayerManagerProps) {
  const nodeRef = useRef<HTMLDivElement>(null!);
  const { filter, setFilter, setPOIFilter, setRouteFilter } = useLayerFilter();

  // State for dropdown sections
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);

  const toggleArrayValue = <T,>(array: T[], value: T): T[] =>
    array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];

  const checkbox = (
    key: string,
    label: string,
    checked: boolean,
    onChange: () => void,
    color?: string
  ) => (
    <label
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "8px 0",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.preventDefault();
        onChange();
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          background: "#2C2C2C",
          borderRadius: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {checked && (
          <img
            src="/map-elements/check.svg"
            alt="Checked"
            style={{
              width: 10.67,
              height: 7.33,
            }}
          />
        )}
      </div>
      <span
        style={{
          color: color || "black",
          fontSize: 14,
          fontFamily: "Manrope",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
    </label>
  );

  const sectionTitle = (title: string) => (
    <div
      style={{
        textAlign: "left",
        color: "black",
        fontSize: 14,
        fontFamily: "Manrope",
        fontWeight: 700,
        marginBottom: 6,
      }}
    >
      {title}
    </div>
  );

  const dropdownHeader = (
    title: string,
    isOpen: boolean,
    setOpen: (open: boolean) => void
  ) => {
    return (
      <div
        style={{
          background: "rgba(228, 228, 228, 0.74)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: isOpen ? "10px 10px 0 0" : 10,
          border: "1px #E4E4E4 solid",
          borderBottom: isOpen ? "none" : "1px #E4E4E4 solid",
          padding: "10px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: isOpen ? 0 : 12,
        }}
        onClick={() => setOpen(!isOpen)}
      >
        <div style={{ fontWeight: 700 }}>{title}</div>
        <img
          src="/map-elements/arrow_drop_down.svg"
          alt="Toggle"
          style={{
            width: 24,
            height: 24,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
    );
  };

  return (
    <Draggable handle=".handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          width: 465,
          height: 832,
          position: "absolute",
          top: "100px",
          left: "100px",
          background: "rgba(255,255,255,0.70)",
          boxShadow: "0px 0px 30px rgba(0,0,0,0.05)",
          borderRadius: 10,
          border: "1px solid #DDDDDD",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <img
          src="/map-elements/close.svg"
          alt="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 13,
            left: 15,
            width: 25,
            height: 22,
            cursor: "pointer",
          }}
        />

        <div
          className="handle"
          style={{
            fontSize: 20,
            fontFamily: "Manrope",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 10,
            color: "black",
          }}
        >
          Layer Manager
        </div>

        {/* Basemap Section */}
        <div
          style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 10,
            border: "1px #E4E4E4 solid",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontFamily: "Manrope",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 8,
              color: "black",
            }}
          >
            Basemap
          </div>

          {/* Use the string literals that match the type in LayerFilterContext */}
          {checkbox(
            "basemap-open-street-map",
            "OpenStreetMap",
            filter.basemapType === "OPEN_STREET_MAP",
            () => setFilter({ basemapType: "OPEN_STREET_MAP" })
          )}

          {checkbox(
            "basemap-satellite",
            "Satellite",
            filter.basemapType === "SATELLITE",
            () => setFilter({ basemapType: "SATELLITE" })
          )}

          {checkbox(
            "basemap-topography",
            "Topography",
            filter.basemapType === "TOPOGRAPHY",
            () => setFilter({ basemapType: "TOPOGRAPHY" })
          )}
        </div>

        {/* Routes Section */}
        <div
          style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 10,
            border: "1px #E4E4E4 solid",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontFamily: "Manrope",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 8,
              color: "black",
            }}
          >
            Routes
          </div>

          {sectionTitle("Filter by Status")}

          {checkbox(
            "route-approved",
            "Accepted",
            filter.routeFilter.status.includes("APPROVED"),
            () =>
              setRouteFilter({
                status: toggleArrayValue(filter.routeFilter.status, "APPROVED"),
              }),
            "#79A44D"
          )}

          {checkbox(
            "route-pending",
            "Proposal",
            filter.routeFilter.status.includes("PENDING"),
            () =>
              setRouteFilter({
                status: toggleArrayValue(filter.routeFilter.status, "PENDING"),
              }),
            "#FF9E44"
          )}

          {checkbox(
            "route-rejected",
            "Declined",
            filter.routeFilter.status.includes("REJECTED"),
            () =>
              setRouteFilter({
                status: toggleArrayValue(filter.routeFilter.status, "REJECTED"),
              }),
            "#E6393B"
          )}
        </div>

        {/* POIs Section */}
        <div
          style={{
            background: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: 10,
            border: "1px #E4E4E4 solid",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontFamily: "Manrope",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 8,
              color: "black",
            }}
          >
            POIs
          </div>

          {sectionTitle("Filter by Status")}

          {/* Explicitly ordered status checkboxes: Accepted, Proposal, Declined */}
          {checkbox(
            `poi-status-${PoiAcceptanceStatus.ACCEPTED}`,
            "Accepted",
            filter.poiFilter.status.includes(PoiAcceptanceStatus.ACCEPTED),
            () =>
              setPOIFilter({
                status: toggleArrayValue(
                  filter.poiFilter.status,
                  PoiAcceptanceStatus.ACCEPTED
                ),
              }),
            "#79A44D"
          )}

          {checkbox(
            `poi-status-${PoiAcceptanceStatus.PENDING}`,
            "Proposal",
            filter.poiFilter.status.includes(PoiAcceptanceStatus.PENDING),
            () =>
              setPOIFilter({
                status: toggleArrayValue(
                  filter.poiFilter.status,
                  PoiAcceptanceStatus.PENDING
                ),
              }),
            "#FF9E44"
          )}

          {checkbox(
            `poi-status-${PoiAcceptanceStatus.DECLINED}`,
            "Declined",
            filter.poiFilter.status.includes(PoiAcceptanceStatus.DECLINED),
            () =>
              setPOIFilter({
                status: toggleArrayValue(
                  filter.poiFilter.status,
                  PoiAcceptanceStatus.DECLINED
                ),
              }),
            "#E6393B"
          )}

          {/* Added larger gap between Status checkboxes and Category section */}
          <div style={{ marginBottom: 20 }}></div>

          {/* Category Dropdown */}
          {sectionTitle("Filter by Category")}
          {dropdownHeader("Category", categoryOpen, setCategoryOpen)}

          {categoryOpen && (
            <div
              style={{
                background: "rgba(228, 228, 228, 0.74)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: "0 0 10px 10px",
                border: "1px #E4E4E4 solid",
                borderTop: "none",
                padding: 6,
                marginBottom: 12,
              }}
            >
              {Object.values(PoiCategory).map((cat) =>
                checkbox(
                  `poi-category-${cat}`,
                  cat === "SIGHTSEEING"
                    ? "Sightseeing"
                    : cat === "FOOD"
                    ? "Food"
                    : cat === "ACCOMODATION"
                    ? "Accommodation"
                    : "Other",
                  filter.poiFilter.category.includes(cat),
                  () =>
                    setPOIFilter({
                      category: toggleArrayValue(
                        filter.poiFilter.category,
                        cat
                      ),
                    })
                )
              )}
            </div>
          )}

          {/* Added larger gap between Category dropdown and Member section */}
          <div style={{ marginBottom: 20 }}></div>

          {/* Creator Dropdown */}
          {sectionTitle("Filter by Member")}
          {dropdownHeader("Member", creatorOpen, setCreatorOpen)}

          {creatorOpen && members.length > 0 && (
            <div
              style={{
                background: "rgba(228, 228, 228, 0.74)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: "0 0 10px 10px",
                border: "1px #E4E4E4 solid",
                borderTop: "none",
                padding: 6,
                marginBottom: 12,
              }}
            >
              {members.map((member) =>
                checkbox(
                  `poi-creator-${member.userId}`,
                  member.username,
                  filter.poiFilter.creatorUserIds.includes(member.userId),
                  () =>
                    setPOIFilter({
                      creatorUserIds: toggleArrayValue(
                        filter.poiFilter.creatorUserIds,
                        member.userId
                      ),
                    })
                )
              )}
            </div>
          )}

          {/* Added larger gap between Member dropdown and Priority section */}
          <div style={{ marginBottom: 20 }}></div>

          {/* Priority Dropdown */}
          {sectionTitle("Filter by Priority")}
          {dropdownHeader("Priority", priorityOpen, setPriorityOpen)}

          {priorityOpen && (
            <div
              style={{
                background: "rgba(228, 228, 228, 0.74)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: "0 0 10px 10px",
                border: "1px #E4E4E4 solid",
                borderTop: "none",
                padding: 6,
                marginBottom: 12,
              }}
            >
              {Object.values(PoiPriority).map((pri) =>
                checkbox(
                  `poi-priority-${pri}`,
                  pri,
                  filter.poiFilter.priority.includes(pri),
                  () =>
                    setPOIFilter({
                      priority: toggleArrayValue(
                        filter.poiFilter.priority,
                        pri
                      ),
                    }),
                  pri === "HIGH" ? "#E6393B" : undefined
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
